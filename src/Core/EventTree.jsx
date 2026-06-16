/**
 * Stores event information in an accessible way.
 * IDs are generated for each event and are accessible on this event tree via
 * EventTree[event_id]
 * Each event contains the ID of its parent and a list of child events.
 */
class EventTree {
  constructor(props) {
    Object.assign(this, props);
  }

  /**
   * Build the tree directly from a flat list of events.
   * Each event's `path` (e.g. "HEK>>Active Region>>HMI SHARP") describes its
   * place in the hierarchy. Group nodes are created on demand from path
   * segments; events that share a path collapse under one group with each
   * event as a sibling leaf.
   *
   * @param {Array}  events Flat array of event objects from the API.
   * @param {string} source Top level event group name (HEK, CCMC, RHESSI, ...).
   */
  static make(events, source) {
    const dict = {
      [source]: {
        label: source,
        path: source,
        id: source,
        state: "unchecked",
        parent_id: null,
        expand: true,
        children: []
      }
    };

    events.forEach((e) => {
      const parts = e.path.split(">>");

      let parentId = null;
      let cumulativePath = "";

      parts.forEach((segment, idx) => {
        cumulativePath = idx === 0 ? segment : `${cumulativePath}>>${segment}`;

        if (!dict.hasOwnProperty(cumulativePath)) {
          dict[cumulativePath] = {
            label: segment,
            path: cumulativePath,
            id: cumulativePath,
            state: "unchecked",
            parent_id: parentId,
            expand: idx < 2,
            children: []
          };

          if (parentId != null) {
            dict[parentId].children.push(cumulativePath);
          }
        }

        parentId = cumulativePath;
      });

      const eventLabel = e.short_label ?? e.label;
      const eventId = `${parentId}>>${e.id}`;

      dict[eventId] = {
        label: eventLabel,
        path: `${parentId}>>${eventLabel}`,
        id: eventId,
        state: "unchecked",
        parent_id: parentId,
        expand: false,
        data: e
      };

      dict[parentId].children.push(eventId);
    });

    return new EventTree(dict);
  }

  toggleCheckbox(id) {
    const stateCycle = {
      checked: "unchecked",
      unchecked: "checked",
      undecided: "checked"
    };

    const newState = stateCycle[this[id]["state"]];

    const nodes = this.getNodes(id);

    for (const n of nodes) {
      this[n].state = newState;
    }

    let parentId = this[id].parent_id;

    while (parentId != null) {
      let siblingsStates = this[parentId].children.map((cid) => this[cid].state);

      this[parentId].state = siblingsStates.reduce(
        (finalState, eventState) => (finalState != eventState ? "undecided" : finalState),
        siblingsStates[0]
      );

      parentId = this[parentId].parent_id;
    }

    return new EventTree({ ...this });
  }

  toggleExpand(id) {
    if (this.hasOwnProperty(id)) {
      this[id].expand = !this[id].expand;
    }

    return new EventTree({ ...this });
  }

  removeSelections() {
    for (const n in this) {
      this[n].state = "unchecked";
    }
    return new EventTree({ ...this });
  }

  applySelections(selections) {
    selections.forEach((id) => {
      if (this.hasOwnProperty(id)) {
        const nodes = this.getNodes(id);

        for (const n of nodes) {
          this[n].state = "checked";
        }

        let parentId = this[id].parent_id;

        while (parentId != null) {
          let siblingsStates = this[parentId].children.map((cid) => this[cid].state);

          this[parentId].state = siblingsStates.reduce(
            (finalState, eventState) => (finalState != eventState ? "undecided" : finalState),
            siblingsStates[0]
          );

          this[parentId].expand =
            this[parentId].state == "undecided" || this.isRoot(parentId) || this.isFirstLevel(parentId);

          parentId = this[parentId].parent_id;
        }
      } else {
        console.warn(id, " selection problem , it is not in tree!");
      }
    });

    return new EventTree({ ...this });
  }

  selectedEvents() {
    const res = [];

    for (const n in this) {
      let node = this[n];
      let isEvent = node.hasOwnProperty("data");

      if (isEvent) {
        if (node.state == "checked") {
          res.push({
            event_data: node.data,
            label: node.label,
            id: node.id
          });
        }
      }
    }

    return res;
  }

  extractSelections() {
    const res = [];

    for (const n in this) {
      let node = this[n];

      // We only care checked ones
      if (node.state == "checked") {
        // its parent could be null, then this means root node is selected
        // or if anynode is selected but its parent not selected
        if (node.parent_id == null || this[node.parent_id].state != "checked") {
          res.push(node.id);
        }
      }
    }

    return res;
  }

  getNodes(id) {
    const isEvent = this[id].hasOwnProperty("data");

    if (isEvent) {
      return [id];
    }

    const allNodes = [id];

    this[id].children.forEach((cid) => {
      allNodes.push(...this.getNodes(cid));
    });

    return allNodes;
  }

  getEventsOfNode(id) {
    const isEvent = this[id].hasOwnProperty("data");

    if (isEvent) {
      return [this[id]];
    }

    const allEvents = [];

    this[id].children.forEach((cid) => {
      allEvents.push(...this.getEventsOfNode(cid));
    });

    return allEvents;
  }

  getEventCount(id) {
    return this.getEventsOfNode(id).length;
  }

  /**
   * An event branch a branch which contains an event data array.
   * Branches containing groups are not event branches.
   */
  isEventBranch(id) {
    const isEvent = this[id].hasOwnProperty("data");

    if (isEvent) {
      return false;
    }

    if (this[id].children.length <= 0) {
      return false;
    }

    const firstChildrenId = this[id].children[0];

    return this[firstChildrenId].hasOwnProperty("data");
  }

  getLevel(id) {
    // trigger exception , if it is not in tree, we handle all exceptions
    const nodeID = this[id].id;

    return nodeID.split(">>").length;
  }

  isRoot(id) {
    return this.getLevel(id) == 1;
  }

  isFirstLevel(id) {
    return this.getLevel(id) == 2;
  }

  adjustSelectionsWithPath(selections) {

    const adjustedSelections = [];

    selections.forEach((s) => {

      // if it is tree no problem
      if (this.hasOwnProperty(s)) {
        adjustedSelections.push(s);
      } else {

        // if it is not in tree
        // we are checking if it is in tree by path
        // if there can multiple ids to match
        // we will be just adding those into the selections with their ids. 

        // We track if there is a node like exists
        let matchedWithPath = false;

        for (const id in this) {
            if(this[id].path == s) {
                adjustedSelections.push(id);
                matchedWithPath = true;
            }
        }

        // if this selection is not pathed one and still not in tree
        // We still keep it since selections doesn't have to be in the tree always
        // but when they are in tree , they will be used to mark nodes, 
        if(!matchedWithPath) {
            adjustedSelections.push(s);
        }
      }
    });

    return adjustedSelections;
  }
}

export default EventTree;
